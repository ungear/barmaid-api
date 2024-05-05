import { PrismaClient } from '@prisma/client';
import * as https from "https";
import * as fs from 'fs';
import * as child_process from 'child_process';


run();

async function run(){
  const prisma = new PrismaClient();
  const drinks = await prisma.drink.findMany({
    select: { id: true, thumbImageUrl: true }
  });

  const picturesFolderPath = __dirname + '/pictures'; 
  fs.mkdirSync(picturesFolderPath);

  for(const drink of drinks) {
    console.log('Processing ' + drink.id)
    const urlSegments = drink.thumbImageUrl.split("/");
    const sourceFilePath = picturesFolderPath + "/" + urlSegments[urlSegments.length - 1];
    const mediumFilePath = sourceFilePath.replace('.jpg', '-200.jpg');
    const smallFilePath = sourceFilePath.replace('.jpg', '-100.jpg');

    // Donwload
    try{
      await downloadImage(drink.thumbImageUrl, sourceFilePath);
    } catch(e) {
      console.error(e);
      continue;
    }

    // Convert
    try{
      await convertImage(sourceFilePath, 100, smallFilePath);
      await convertImage(sourceFilePath, 200, mediumFilePath);
    } catch(e){
      console.error(e);
      continue;
    }

    // Remove Source
    fs.unlinkSync(sourceFilePath);

    // Update DB
    await updateDb(prisma, drink.id, smallFilePath, mediumFilePath);

    // Converted images are copied to aws manually
  }
}

async function downloadImage(url: string, filename: string){
  const file = fs.createWriteStream(filename);
  const promise = new Promise<void>((res, rej) => {
    https.get(url, (response) => {
      if(response.statusCode !== 200) { 
        rej("Error downloading image " + url + " Status code " + response.statusCode);
      }
      response.pipe(file);
      file.on("finish", () => {
        file.close();
        res();
      });
    }).on('error', rej);

  })

  return promise;
} 

async function convertImage(sourcePath: string, size: number, resultPath: string){
  const command = `magick ${sourcePath} -resize ${size}x${size} ${resultPath}`;

  const promise = new Promise<void>((res, rej) => {
    child_process.exec(command, (err, stdout, stderr) => {
      if (err) {
        // node couldn't execute the command
        rej(err);
      } else {
        res()
      }
    
      // // the *entire* stdout and stderr (buffered)
      // console.log(`stdout: ${stdout}`);
      // console.log(`stderr: ${stderr}`);
    });

  })

  return promise;
}

async function updateDb(prisma: any, drinkId: number, smallImagePath: string, mediumImagePath: string){
  const serverUrl = "https://s3.amazonaws.com/pictures.barmaid.net/";
  const smallImageName = smallImagePath.replace(/.*\//, '');
  const mediumImageName = mediumImagePath.replace(/.*\//, '');
  await prisma.drink.update({
    where: {
      id: drinkId,
    },
    data:{
      imageSmall: serverUrl + smallImageName,
      imageMedium: serverUrl + mediumImageName,
    }
  })
}

