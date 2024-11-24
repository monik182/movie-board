import { Button, message } from 'antd'
import { ShareAltOutlined } from '@ant-design/icons'

interface SharePageProps {
  sessionId?: string | null
}

export const SharePage = ({ sessionId }: SharePageProps) => {
  const handleShare = () => {
    let currentUrl = window.location.origin 
    if (sessionId) {
      currentUrl = currentUrl + `?id=${sessionId}`
    }

    if (navigator.share) {
      navigator.share({
        title: 'Check out this page',
        url: currentUrl,
      })
        .then(() => message.success('Page shared successfully'))
        .catch((error) => message.error('Error sharing: ' + error))
    } else {
      navigator.clipboard.writeText(currentUrl)
        .then(() => {
          message.success('Link copied to clipboard')
        })
        .catch(() => {
          message.error('Failed to copy the link')
        })
    }
  }

  return (
    <Button type="default" icon={<ShareAltOutlined />} onClick={handleShare}>
      Share this Page
    </Button>
  )
}

