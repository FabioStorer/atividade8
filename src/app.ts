import express from 'express';
import { Request, Response } from 'express';
import 'dotenv/config.js';
import { validate, mask, fake } from 'validation-br/dist/cpf';
import z from 'zod';

const cpf = require('validation-br/dist/cpf');

const app = express();

app.use(express.json());

const clientValidation = z.object({
    cpf: z.union([z.number(), z.string()]).transform((val) => {

        let numCpf = typeof val === 'string' ? Number(val) : val;

        if (numCpf === 1) {
            numCpf = Number(cpf.generate());
        }

        return numCpf;
    }),
    name: z.string(),
    rg: z.number(),
    cep: z.number(),
    street: z.string(),
    neighborhood: z.string(),
    city: z.string(),
    state: z.string(),
    email: z.string().email()
});

let fakecpf: number = cpf.fake()

const clients: Client[] = [{
    cpf: 1,
    name: 'Carlos',
    rg: 13112332113,
    cep: 11144444,
    street: 'qweewq',
    neighborhood: 'qweewqeee',
    city: 'qqqqqqq',
    state: 'qwwwww',
    email: 'carlos'
}];

clients[0]!.cpf = fakecpf

interface Pessoa {
    cpf: number,
    name: string,
    rg: number
};

interface Endereco {
    cep: number,
    street: string,
    neighborhood: string,
    city: string,
    state: string
};

interface Client extends Pessoa, Endereco {
    email: string
};

app.post('/cliente', (req: Request, res: Response) => {
    try {
        let clientData = req.body;

        if (clientData.cpf === 1) {
            clientData.cpf = cpf.fake();
        }

        const client = clientValidation.parse(clientData);

        validate(client.cpf);

        clients.push(client);

        console.log(clients);
        return res.send('Cliente cadastrado com sucesso.');
    } catch (err) {
        return res.status(400).send('Dados inválidos e/ou faltando.');
    }
});

app.get('/cliente', (req: Request, res: Response) => {
    res.json(clients);
});

app.get('/cliente/:cpf', (req: Request, res: Response) => {
    const cpf = Number(req.params.cpf);

    const cliente = clients.find(c => c.cpf === cpf);

    if (!cliente) {
        return res.status(404).json({ error: 'Cliente não encontrado' });
    }

    res.json(cliente);
});

app.put('/cliente/:cpf', (req: Request, res: Response) => {
    const cpf = Number(req.params.cpf);

    const index = clients.findIndex(c => c.cpf === cpf);

    if (index === -1) {
        return res.status(404).json({ error: 'Cliente não encontrado' });
    }

    clients[index] = req.body;

    res.send('Cliente atualizado com sucesso!');
});

app.delete('/cliente/:cpf', (req: Request, res: Response) => {
    const cpf = Number(req.params.cpf);

    const index = clients.findIndex(c => c.cpf === cpf);

    if (index === -1) {
        return res.status(404).json({ error: 'Cliente não encontrado' });
    }

    clients.splice(index, 1);

    res.send('Cliente removido com sucesso!');
});

app.listen(process.env.API_PORT, () => {
    console.log(`Server running at port ${process.env.API_PORT}.`);
});