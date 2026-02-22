import express, { type Request, type Response } from 'express';
const router = express.Router();
import { prisma } from '../connectors/prisma';
import { addTask } from '../connectors/mockQ';
import { getJSONfile } from '../connectors/files';

router.post('/', async (req: Request, res: Response) => {
  const {name, organization} = req.body;
  console.log(`recieved request to research participant: ${name} in ${organization}`);

  const existing = await prisma.participant.findFirst({
    where: {
      name: name,
      organization: organization
    }
  });

  if (existing) {
    console.log(`participant already exists`)
    res.json({result: 'participant already exists'})
  } else {
    await prisma.participant.create({
      data: {
        name: name,
        organization: organization,
        status: 'pending',
      }
    });
    addTask({type: 'participant_research', payload: {name, organization}});
    res.json({result: 'participant added. results will be ready in a while'})
  }
})

// route for admins to see the list of orgs registreed
router.get('/', async (req: Request, res: Response) => {
  console.log(`recieved request to read reasearch output for: ${req.query.name} in ${req.query.organization}}`)
  const participant = await prisma.participant.findFirst({
    where: {
      name: req.query.name as string,
      organization: req.query.organization as string
    }
  });
  if (participant) {
    if (participant.status === 'ready') {
      res.json({result: 'research ready', notes: await getJSONfile(participant.id)})
    } else {
      res.json({result: 'research not ready yet. try again later', status: participant.status})
    }
  } else {
    res.json({result: 'no research was requested for the participant'})
  }
})

export default router;
