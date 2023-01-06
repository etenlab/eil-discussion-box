import React, { useMemo, MouseEvent } from 'react'

import { Stack } from '@mui/material'

import { IReaction, IPost } from '../utils/types'
import { sortByContent } from '../utils/helpers'
import { Reaction } from './Reaction'
import { AddReactionButton } from '../common/AddReactionButton'

import { useDiscussionContext } from '../hooks/useDiscussionContext'

interface ReactionListProps {
  /**
   * Lists of reactions about specific post
   */
  reactions: IReaction[]
  post: IPost
}

/**
 * List of Reactions
 */
export function ReactionList({ reactions, post }: ReactionListProps) {
  const {
    states: {
      global: { userId },
    },
    actions: { openEmojiPicker, deleteReaction, createReaction },
  } = useDiscussionContext()

  const handleClickReaction = (content: string) => {
    const reaction = reactions.find(
      (reaction) => reaction.content === content && reaction.user_id === userId,
    )

    if (reaction) {
      deleteReaction({
        variables: {
          id: reaction.id,
          userId,
        },
      })
    } else {
      createReaction({
        variables: {
          reaction: {
            content,
            post_id: post.id,
            user_id: userId,
          },
        },
      })
    }
  }

  const handleOpenEmojiPicker = (event: MouseEvent<HTMLButtonElement>) => {
    openEmojiPicker(event.currentTarget, post, 'react')
  }

  const contentReactions = useMemo(() => sortByContent(reactions), [reactions])

  return (
    <Stack direction="row" sx={{ flexWrap: 'wrap', gap: '10px' }}>
      {contentReactions.map(({ content, reactions }) => (
        <Reaction
          key={content}
          content={content}
          reactions={reactions}
          onClick={handleClickReaction}
        />
      ))}
      <AddReactionButton onClick={handleOpenEmojiPicker} />
    </Stack>
  )
}
