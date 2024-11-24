import { useMemo } from 'react'
import { EnhancedMovie } from '../types'
import { IconText } from './IconText'
import { DeleteOutlined, EyeOutlined, PlusCircleOutlined, StarOutlined } from '@ant-design/icons'
import { Tooltip } from 'antd'
import styled from 'styled-components'

interface ActionButtonsProps {
  item: EnhancedMovie
  onAdd?: (item: EnhancedMovie) => void
  onChange?: (item: EnhancedMovie) => void
  onDelete?: (id: EnhancedMovie['id']) => void
}

export function ActionButtons({ item, onAdd, onChange, onDelete }: ActionButtonsProps) {
  const actions = useMemo(() => {
    const popularityValue = item.popularity?.toString().split('.')[0]

    const actions = [
      {
        key: 'stars',
        icon: StarOutlined,
        text: popularityValue,
        tooltipText: `Popularity: ${popularityValue}`,
        iconStyle: { color: 'gold' }
      },
      {
        key: 'add',
        icon: PlusCircleOutlined,
        tooltipText: 'Add to Watch list',
        onClick: () => onAdd?.(item),
      },
      {
        key: 'change',
        icon: EyeOutlined,
        tooltipText: `Mark as ${item.watched ? 'Unwatched' : 'Watched'}`,
        iconStyle: { color: item.watched ? 'green' : undefined },
        onClick: () => onChange?.(item),
      },
      {
        key: 'delete',
        icon: DeleteOutlined,
        tooltipText: 'Remove',
        onClick: () => onDelete?.(item.id),
        iconStyle: { color: 'red' }
      }
    ]

    const filteredActions = []
    for (const action of actions) {
      if ((!onAdd || item.saved) && action.key === 'add') {
        continue
      }

      if (!onChange && action.key === 'change') {
        continue
      }

      if (!onDelete && action.key === 'delete') {
        continue
      }

      filteredActions.push(action)
    }
    return filteredActions

  }, [onAdd, onChange, onDelete, item])

  return (
    <Container>
      {actions.map((action) => (
        <Tooltip title={action.tooltipText} key={action.key}>
          <div>
            <IconText
              icon={action.icon}
              text={action.text}
              iconStyle={action.iconStyle}
              onClick={action.onClick}
            />
          </div>
        </Tooltip>
      ))}
    </Container>
  )
}

const Container = styled.div`
  margin-top: 10px;
  padding: 5px;
  border: 1px solid #f0f0f0;
  border-radius: 5px;
  display: flex;
  width: 100%;
  justify-content: space-evenly;
  align-items: center;
  box-sizing: border-box;
`
