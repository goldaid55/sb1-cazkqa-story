import { Storage } from '@google-cloud/storage';

   const storage = new Storage({
     projectId: 'YOUR_PROJECT_ID',
     keyFilename: 'path/to/your/service-account-key.json'
   });

   const bucketName = 'YOUR_BUCKET_NAME';

   export async function saveStory(story) {
     const bucket = storage.bucket(bucketName);
     const file = bucket.file(`stories/${story.id}.json`);

     await file.save(JSON.stringify(story), {
       contentType: 'application/json',
       metadata: {
         cacheControl: 'public, max-age=31536000',
       },
     });

     console.log(`Story ${story.id} saved to ${bucketName}`);
   }

   export async function getStories() {
     const [files] = await storage.bucket(bucketName).getFiles({ prefix: 'stories/' });
     const stories = await Promise.all(
       files.map(async (file) => {
         const [content] = await file.download();
         return JSON.parse(content.toString());
       })
     );
     return stories;
   }