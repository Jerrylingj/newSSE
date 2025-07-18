import { useUserStore } from '@/store/userStore'
import { requestFunc } from '../req'

const apiUrl = import.meta.env.VITE_API_BASE_URL

async function updateUserInfo(avatarURL: string, intro: string, name: string, userID: number) {
  try {
    const res = await requestFunc(`/auth/updateUserInfo`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: {
        avatarURL,
        intro,
        name,
        userID,
      },
    }, true)
    const data = await res!.json()
    return data
  }
  catch (e) {
    console.error(e)
  }
}

async function uploadAvatar(photo: File) {
  const token = useUserStore().token.value
  if (!token) {
    return
  }
  const formData = new FormData()

  if (photo instanceof File) {
    formData.append('file', photo, photo.name)
  }
  else {
    console.error('Invalid file object:', photo)
    throw new Error('Invalid file object')
  }

  try {
    const response = await fetch(`${apiUrl}/auth/uploadAvatar`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
    return data
  }
  catch (error) {
    console.error('Error uploading photo:', error)
    throw error
  }
}

async function updateEmailPush(user_id: number) {
  try {
    await requestFunc(`/auth/changeEmailPush`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: {
        user_id,
      },
    }, true)
    // const data = await res.json()
    // return data
  }
  catch (e) {
    console.error(e)
  }
}
export { updateEmailPush, updateUserInfo, uploadAvatar }
