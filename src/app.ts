import express from 'express';
import { Request, Response } from 'express';
import 'dotenv/config.js';

const app = express();

app.use(express.json());

const clients: Client[] = [];

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
    const client: Client = (req.body);
    clients.push(client);
    console.log(clients)
    return res.send('Cliente cadastrado com sucesso.');
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