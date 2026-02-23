import express, { type Request, type Response } from 'express';
const router = express.Router();
import { prisma } from '../connectors/prisma';
import { addTask } from '../connectors/mockQ';
import { getJSONfile } from '../connectors/files';

router.post('/', async (req: Request, res: Response) => {
  const {name, organization} = req.body;
  console.log(`recieved request to research participant: ${name} in ${organization}`);

  const participant = await prisma.participant.create({
    data: {
      name: name,
      organization: organization,
      status: 'pending',
    }
  });
  addTask({type: 'participant_research', payload: participant});
  res.json({result: 'participant added. results will be ready in a while'})
})

// route to list all participants
router.get('/', async (req: Request, res: Response) => {
  console.log(`recieved request to list all participants`)
  const participants = await prisma.participant.findMany(
    {
      select: {
        id: true,
        name: true,
        organization: true,
        status: true,
      },
      orderBy: {
        id: 'asc',
      }
    }
  );

  res.json(participants)
})

router.get('/:id', async (req: Request, res: Response) => {
  console.log(`recieved request to read reasearch output for: ${req.params.id}`)
  const participant = await prisma.participant.findFirst({
    where: {
      id: parseInt(req.params.id as string)
    }
  });
  if (participant) {
    if (participant.status === 'ready') {
      res.json({result: 'research ready', notes: (await getJSONfile(participant.id)).response.candidates[0].content.parts[0].text})
    } else {
      res.json({result: 'research not ready yet. try again later', status: participant.status})
    }
  } else {
    res.json({result: 'invalid id'})
  }
})


export default router;
