import { Participant } from "../../prisma/generated/prisma/client";
import { putJSONfile } from "../connectors/files";
import { prisma } from "../connectors/prisma";
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({});

export const participantResearchWorker = async (participant: Participant) => {
  console.log(`start researching participant ${participant.name} in ${participant.organization}`);

  await prisma.participant.update({
    where: {
      id: participant.id
    },
    data: {
      status: 'researching'
    }
  })

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `i run a startup in personal finance space. i have a meeting with  "${participant.name}" who is a partner at "${participant.organization}". 

gather information about them and their company from their website and blogs, youtube videos and podcasts where they have appeared

try to find as many sources as you can and then summarise all of them into points for me to understand their investment philosophy and how i should pitch to them`
  });
  console.log(response);

  await prisma.participant.update({
    where: {
      id: participant.id
    },
    data: {
      status: 'ready'
    }
  })
  await putJSONfile(participant.id, {
    response
  })
}