import { db } from "@/db";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { createUploadthing, type FileRouter } from "uploadthing/next";
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { OpenAIEmbeddings } from "@langchain/openai";
import { PineconeStore } from "@langchain/pinecone";
import { pineconeClient } from "@/lib/pinecone";

const f = createUploadthing();

const middleware = async () => {
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  if (!user || !user.id) throw new Error("Unauthorized");

  return { userId: user.id };
};

const onUploadComplete = async ({
  metadata,
  file,
}: {
  metadata: Awaited<ReturnType<typeof middleware>>;
  file: {
    key: string;
    name: string;
    url: string;
  };
}) => {
  const isFileExist = await db.file.findFirst({
    where: {
      key: file.key,
    },
  });

  if (isFileExist) return;

  const createdFile = await db.file.create({
    data: {
      key: file.key,
      name: file.name,
      userId: metadata.userId,
      url: `https://utfs.io/f/${file.key}`,
      uploadStatus: "PROCESSING",
    },
  });

  console.log("Created file id is ", createdFile.id);

  try {
    const response = await fetch(`https://utfs.io/f/${file.key}`);

    console.log("Uploadthing fetch response", response);

    const blob = await response.blob();

    const loader = new PDFLoader(blob);

    const pageLevelDocs = await loader.load();

    //const pagesAmt = pageLevelDocs.length;

    // vectorize and index entire document

    const pineconeIndex = pineconeClient.Index("doculens");
    //console.log("Pinecone doculens index", pineconeIndex);

    const embeddings = new OpenAIEmbeddings({
      openAIApiKey: process.env.OPENAI_API_KEY,
    });

    // Add a 'dataset' field to the data to distinguish the source
    const combinedData = pageLevelDocs.map((document) => {
      return {
        ...document,
        metadata: {
          fileId: createdFile.id,
        },
        dataset: "pdf", // Use a field to indicate the source dataset
      };
    });

    const vectorStore = await PineconeStore.fromExistingIndex(embeddings, {
      pineconeIndex,
    });

    const res = await vectorStore.addDocuments(combinedData);

    console.log("Response from pinecone store is", res);

    await db.file.update({
      data: {
        uploadStatus: "SUCCESS",
      },
      where: {
        id: createdFile.id,
      },
    });
  } catch (err) {
    console.log("Error is ", err);
    await db.file.update({
      data: {
        uploadStatus: "FAILED",
      },
      where: {
        id: createdFile.id,
      },
    });
  }
};

export const ourFileRouter = {
  pdfUploader: f({ pdf: { maxFileSize: "4MB" } })
    .middleware(middleware)
    .onUploadComplete(onUploadComplete),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
