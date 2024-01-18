import { ID, storage } from '../appwrite'

const uploadImage = async (file: File) => {
  if (!file) {
    return
  }
  const fileUplaoded = await storage.createFile(
    `${process.env.NEXT_PUBLIC_APPWRITE_BUCKET_ID}`,
    ID.unique(),
    file
  )
  return fileUplaoded
}
export default uploadImage
