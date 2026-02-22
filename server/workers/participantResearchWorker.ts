import { putJSONfile } from "../connectors/files";
import { prisma } from "../connectors/prisma";
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({});

export type ParticipantResearchTask = {
  name: string;
  organization: string;
}

export const participantResearchWorker = async (task: ParticipantResearchTask) => {
  console.log(`start researching participant ${task.name} in ${task.organization}`);

  const participant = await prisma.participant.findFirst({
    where: {
      name: task.name,
      organization: task.organization
    }
  })
  if (participant) {
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
      contents: `i run a startup in personal finance space. i have a meeting with "${participant.name}" who is a partner at "${participant.organization}". tell me all you can find about him and what kind of startups they invest in and any other information i should know before i meet him`,
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
}