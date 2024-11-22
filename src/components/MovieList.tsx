import React from 'react';
import { EnhancedMovie } from '../types'
import { Alert, List, Space } from 'antd'
import { LikeOutlined, CheckCircleOutlined, StarOutlined, DeleteOutlined, BorderOutlined, PlusCircleOutlined } from '@ant-design/icons';
import styled from 'styled-components';

interface MovieListProps {
  title?: string
  movies: EnhancedMovie[]
  onAdd?: (movie: EnhancedMovie) => void
  onChange?: (movie: EnhancedMovie) => void
  onDelete?: (id: EnhancedMovie['id']) => void
  pagination?: {
    onChange?: (page: number) => void
    pageSize?: number
    total?: number
    current?: number
  }
}

const IconText = ({ icon, text, onClick }: { icon: React.FC; text: string, onClick?: () => void }) => (
  <Space onClick={onClick} style={{ cursor: onClick ? 'pointer' : 'inherit' }}>
    {React.createElement(icon)}
    {text}
  </Space>
)

export function MovieList({ title, movies, pagination, onAdd, onDelete, onChange }: MovieListProps) {

  function getActions(item: EnhancedMovie) {
    const actions = [
      <IconText icon={StarOutlined} text={item.popularity?.toString()} key="action-stars" />,
      // <IconText icon={LikeOutlined} text={item.vote_average?.toString()} key="action-likes" />,
    ]

    if (onAdd && !item.saved) {
      actions.push(<IconText icon={PlusCircleOutlined} text="Add Movie to Watch list" key="action-add" onClick={() => onAdd(item)} />)
    }

    if (onChange) {
      actions.push(<IconText icon={!item.watched ? BorderOutlined : CheckCircleOutlined} text={`${item.watched ? '' : 'Not '}Watched`} key="action-change" onClick={() => onChange(item)} />)
    }

    if (onDelete) {
      actions.push(<IconText icon={DeleteOutlined} text="Remove" key="action-delete" onClick={() => onDelete(item.id)} />)
    }

    return actions;
  }


  return (
    <div>
      {title && <h2>{title}</h2>}
      <List
        itemLayout="vertical"
        // itemLayout="horizontal"
        size="large"
        grid={{ gutter: 20, column: 4 }}
        pagination={{
          onChange: pagination?.onChange,
          pageSize: pagination?.pageSize || 10,
          total: pagination?.total,
          current: pagination?.current,
          showSizeChanger: false,
        }}
        dataSource={movies}
        renderItem={(item) => (
          <StyledListItem
            key={item.id}
            actions={getActions(item)}
          >
            <List.Item.Meta
              title={item.title}
              description={generateDescription(item)}
            />
          </StyledListItem>
        )}
      />
    </div>
  )
}

function generateDescription(item: EnhancedMovie) {
  return (
    <div>
      {item.poster_path && <img
        width={200}
        alt="logo"
        src={`${process.env.REACT_APP_IMG_URL}w200/${item.poster_path}`}
      />}

      {/* <p>{item.overview.slice(0, 100)}...</p> */}
      <p>Release date: {item.release_date}</p>
      {item.saved && <Alert message="Movie already in your watch list" type="success" showIcon />}
    </div>
  )
}

const StyledListItem = styled(List.Item)`
  // border: 1px solid;
  // border-radius: 5px;
  // margin-bottom: 20px;
`
