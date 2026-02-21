import express, { type Request, type Response } from 'express';
const router = express.Router();
import { prisma } from '../connectors/prisma';

router.post('/', async (req: Request, res: Response) => {
  const {name, organization} = req.body;
  console.log(`prepare participant notes for ${name} in ${organization}`);

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
    })
    res.json({result: 'participant added. results will be ready in a while'})
  }
})

// route for admins to see the list of orgs registreed
router.get('/', async (req: Request, res: Response) => {
  res.json({ message: 'person found' });
})

export default router;
