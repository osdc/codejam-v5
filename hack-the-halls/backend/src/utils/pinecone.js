import pinecone from "../config/pinecone.js";

export function chunkLecture(lectureText, chunkSize = 500) {
  const chunks = [];
  const overlap = 50;
  let start = 0;

  console.log("before while");

  while (start < lectureText.length) {
    let end = start + chunkSize;
    if (end > lectureText.length) {
      end = lectureText.length;
    }

    chunks.push(lectureText.slice(start, end));
    start = Math.max(end - overlap, start + 1);
  }
  console.log("after while");

  return chunks;
}

export async function storeLecture(lectureText, lectureId, lectureName) {
  try {
    const index = pinecone.index("testing");

    console.log("before chunking");

    const chunks = chunkLecture(lectureText);

    console.log("after chunking");

    let data = chunks.map((chunk, i) => ({
      id: `${lectureId}_chunk_${i}`,
      text: chunk,
    }));

    console.log("before upsert");

    const embeddings = await pinecone.inference.embed(
      "multilingual-e5-large",
      data.map((d) => d.text),
      { inputType: "passage", truncate: "END" }
    );

    const vectors = data.map((d, i) => ({
      id: d.id,
      values: embeddings[i].values,
      metadata: {
        lectureId,
        chunkSequence: i,
        lectureName: lectureName,
        text: d.text,
      },
    }));

    await index.namespace("example-namespace").upsert(vectors);
    console.log("Lecture stored successfully");
    return true;
  } catch (error) {
    console.error("Error storing lecture:", error);
    return false;
  }
}

export async function searchLecture(
  index,
  queryText,
  lectureId = null,
  topK = 3
) {
  try {
    const queryRequest = {
      vector: queryText, // Pinecone handles embedding
      topK,
      includeMetadata: true,
    };

    // Add filter if lectureId is provided
    if (lectureId) {
      queryRequest.filter = { lectureId };
    }

    const results = await index.query(queryRequest);

    return results.matches.map((match) => ({
      text: match.metadata.text,
      score: match.score,
      lectureId: match.metadata.lectureId,
      chunkSequence: match.metadata.chunkSequence,
    }));
  } catch (error) {
    console.error("Error searching lecture:", error);
    return [];
  }
}
