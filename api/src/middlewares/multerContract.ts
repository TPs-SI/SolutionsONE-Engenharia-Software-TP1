import { S3Client, PutObjectCommand, ObjectCannedACL, DeleteObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import fs from 'fs';
import 'dotenv/config';
import { Readable } from 'stream';
import prisma from '../../config/prismaClient';
import statusCodes from '../../utils/constants/statusCodes';
import { Response } from 'express';
import { InvalidParamError } from '../../errors/InvalidParamError';

const storageS3 = new S3Client({
    region: process.env.AWS_BUCKET_REGION!,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
        secretAccessKey: process.env.AWS_SECRET_KEY!,
    }
});

export const storageTypes = async (filepath: string, contratoID: number) => {
    const fileContent = fs.readFileSync(filepath);

    const uploadParams = {
        Bucket: process.env.AWS_BUCKET_CONTRACT!,
        Key: `contratos/contrato_${contratoID}.pdf`,
        Body: fileContent,
        ContentType: 'application/pdf',
        ACL: ObjectCannedACL.private,
    };

    const command = new PutObjectCommand(uploadParams);
    await storageS3.send(command);

    // Verifica se o arquivo ainda existe antes de tentar deletá-lo
    if (fs.existsSync(filepath)) {
        fs.unlinkSync(filepath);
        console.log(`Arquivo temporário ${filepath} excluído com sucesso.`);
    }

    return uploadParams.Key;
};

export async function DeletarContratoDaAWS(S3Chave: string): Promise<void> {
    try {
        await storageS3.send(
            new DeleteObjectCommand({
                Bucket: process.env.AWS_BUCKET_CONTRACT!,
                Key: S3Chave
            })
        );
        console.log(`Arquivo ${S3Chave} excluído com sucesso.`);
    } catch (error) {
        console.error(`Erro ao excluir o arquivo ${S3Chave}:`, error);
        throw new Error(`Erro ao excluir o arquivo ${S3Chave}`);
    }
}

// export const downloadContract = async (contractId: number, res: Response) => {
//     try {
//         // Buscar os dados do contrato
//         const contract = await prisma.contract.findUnique({
//             where: { id: contractId },
//             select: { key: true }
//         });

//         if (!contract || !contract.key) {
//             throw new Error('Chave do arquivo não encontrada para o contrato fornecido');
//         }

//         const command = new GetObjectCommand({
//             Bucket: process.env.AWS_BUCKET_CONTRACT!,
//             Key: contract.key,
//         });

//         const contractFile = await storageS3.send(command);

//         if (!contractFile.Body) {
//             throw new Error('O arquivo não foi encontrado ou está vazio');
//         }

//         const stream = contractFile.Body as Readable;

//         const buffer = await streamToBuffer(stream);

//         res.setHeader('Content-Disposition', `attachment; filename="${contract.key.split('/').pop()}"`);
//         res.setHeader('Content-Type', contractFile.ContentType || 'application/pdf');
//         res.send(buffer);

//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ error: 'Erro ao fazer o download do contrato' });
//     }
// };

const streamToBuffer = (stream: Readable): Promise<Buffer> => {
    return new Promise((resolve, reject) => {
        const chunks: Buffer[] = [];
        stream.on('data', chunk => chunks.push(chunk));
        stream.on('end', () => resolve(Buffer.concat(chunks)));
        stream.on('error', reject);
    });
};