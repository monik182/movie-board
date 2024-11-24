import { Space } from 'antd'

interface IconTextProps {
  icon: React.FC<{ style?: React.CSSProperties }>
  text?: string
  onClick?: () => void
  style?: React.CSSProperties
  iconStyle?: React.CSSProperties
}

export const IconText = ({ icon: Icon, text, onClick, style = {}, iconStyle = {} }: IconTextProps) => (
  <Space onClick={onClick} style={{ cursor: onClick ? 'pointer' : 'inherit', ...style }}>
    <Icon style={iconStyle} />
    {text}
  </Space>
)
