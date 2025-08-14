import express from 'express';
import { Request, Response } from 'express';
import 'dotenv/config.js';
import { validate, mask } from 'validation-br/dist/cpf'
const cpf = require('validation-br/dist/cpf')

const app = express();

app.use(express.json());

const fakecpf: number = cpf.fake()

const clients: Client[] = [ {
    cpf: 1,
    name: 'Carlos',
    rg: 13112332113,
    cep: 11144444,
    street: 'qweewq',
    neighborhood: 'qweewqeee',
    city: 'qqqqqqq',
    state: 'qwwwww',
    email: 'carlos'
} ];

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
    const client: Client = (req.body);

    if (client.cpf !== undefined && client.cpf !== null &&
        client.name !== undefined && client.name !== null && client.name !== '' &&
        client.rg !== undefined && client.rg !== null &&
        client.cep !== undefined && client.cep !== null &&
        client.street !== undefined && client.street !== null && client.street !== '' &&
        client.neighborhood !== undefined && client.neighborhood !== null && client.neighborhood !== '' &&
        client.city !== undefined && client.city !== null && client.city !== '' &&
        client.state !== undefined && client.state !== null && client.state !== '' &&
        client.email !== undefined && client.email !== null && client.email !== ''
    ) {

        let newcpf: number = 1;

        if (client.cpf === 1) {
            newcpf = cpf.fake();
        };

        validate(newcpf);

        if (newcpf) {
            client.cpf = newcpf
        }
        clients.push(client);
        console.log(clients)
        return res.send('Cliente cadastrado com sucesso.');
    } else {
        return res.send('Dados inválidos e/ou faltando.');
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