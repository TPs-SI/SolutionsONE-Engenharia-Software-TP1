import PizZip from "pizzip";
import Docxtemplater from "docxtemplater";
import fs from "fs";
import path from "path";
import { Contract } from "@prisma/client";
import docxToPdf from 'docx-pdf';
import tmp from "tmp";
import { storageTypes } from "../../src/middlewares/multerContract";
import { exec } from 'child_process';

export function transformarData(data: string): { dia: number, mes: string, ano: number } {
    // Lista de nomes dos meses em português
    const nomesMeses = [
        'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
        'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
    ];

    // Separar a string em dia, mês e ano
    const partes = data.split('/');
    const dia = parseInt(partes[0]);
    const mes = nomesMeses[parseInt(partes[1]) - 1];
    const ano = parseInt(partes[2]);

    // Retornar as variáveis como um objeto
    return {
        dia,
        mes,
        ano
    };
}

export async function docxSubs(body: Contract, dia: number, mes: string, ano: number): Promise<string> {
    return new Promise((resolve, reject) => {
      // Cria um arquivo temporário para o DOCX
      tmp.file({ postfix: '.docx' }, (err, docxPath, docxFd, cleanupCallback) => {
        if (err) {
          return reject(err); // Rejeita a Promise se ocorrer um erro
        }
  
        const filePath = path.resolve(__dirname, '..', 'contract', 'input_versãoplaceholder1.docx');
        const content = fs.readFileSync(filePath, 'binary');
  
        const zip = new PizZip(content);
        const doc = new Docxtemplater(zip, {
          paragraphLoop: true,
          linebreaks: true,
        });
  
        doc.render({
          ID_CONTRATO: body.id,
          NOME_CLIENTE: body.nameClient,
          DATA_VENDA_CONTRATO: body.date,
          VALOR_CONTRATO: body.value,
          DIA_VENDA_CONTRATO: dia,
          MES_VENDA_CONTRATO_EXTENSO: mes,
          ANO_VENDA_CONTRATO: ano
        });
  
        const buf = doc.getZip().generate({
          type: 'nodebuffer',
          compression: 'DEFLATE',
        });
  
        fs.writeFile(docxPath, buf, (writeErr) => {
          if (writeErr) {
            cleanupCallback(); // Limpa o arquivo temporário em caso de erro
            return reject(writeErr); // Rejeita a Promise se ocorrer um erro ao escrever o arquivo
          }
  
          resolve(docxPath); // Resolve a Promise com o caminho do arquivo temporário
        });
      });
    });
  }

  export async function convertDocxToPdf(docxPath: string, id: number): Promise<any> {
    return new Promise((resolve, reject) => {
      // Cria um diretório temporário para armazenar o PDF
      tmp.dir({ unsafeCleanup: true }, (err, tempDir, cleanupCallback) => {
        if (err) {
          return reject(err);
        }
  
        // Define o caminho para o PDF gerado
        const pdfFileName = path.basename(docxPath, '.docx') + '.pdf';
        const pdfPath = path.join(tempDir, pdfFileName);
  
        // Substitua o caminho abaixo pelo caminho completo do LibreOffice se necessário
        const libreOfficePath = process.env.LIBREOFFICE_PATH;
  
        // Converte DOCX para PDF usando LibreOffice
        exec(`"${libreOfficePath}" --headless --convert-to pdf --outdir "${tempDir}" "${docxPath}"`, (convertErr, stdout, stderr) => {
          if (convertErr) {
            cleanupCallback();
            return reject(convertErr);
          }
  
          // Verifica se o arquivo PDF foi criado
          fs.access(pdfPath, fs.constants.F_OK, (accessErr) => {
            if (accessErr) {
              cleanupCallback();
              return reject(new Error('PDF file not found after conversion.'));
            }
  
            // Garante que o arquivo PDF está pronto para leitura
            fs.readFile(pdfPath, (readErr, pdfFile) => {
              if (readErr) {
                cleanupCallback();
                return reject(readErr);
              }
  
              // Remove o diretório temporário e todos os arquivos nele
              cleanupCallback();
  
              const file = storageTypes(pdfPath, id);
              resolve(file);
            });
          });
        });
      });
    });
  }