import React from 'react'
import { Button, message } from 'antd'
import { useLocation } from 'react-router-dom'
import { ShareAltOutlined } from '@ant-design/icons'

interface SharePageProps {
  sessionId?: string | null
}

export const SharePage = ({ sessionId }: SharePageProps) => {
  const location = useLocation()

  const handleShare = () => {
    let currentUrl = window.location.origin + location.pathname + location.search
    if (sessionId) {
      currentUrl = currentUrl + `?id=${sessionId}`
    }

    if (navigator.share) {
      // If the Web Share API is available
      navigator.share({
        title: 'Check out this page',
        url: currentUrl,
      })
        .then(() => message.success('Page shared successfully'))
        .catch((error) => message.error('Error sharing: ' + error))
    } else {
      // Fallback to copying the URL
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
    <Button type="primary" icon={<ShareAltOutlined />} onClick={handleShare}>
      Share this Page
    </Button>
  )
}

