import React, { Fragment, useEffect, useRef, useCallback } from 'react';

import { Divider, Stack } from '@mui/material';

import { Post } from './Post';
import { ScrollDownButton } from '../common/ScrollDownButton';

import { useDiscussionContext } from '../hooks/useDiscussionContext';

export function PostList() {
  const {
    states: { discussion },
  } = useDiscussionContext();
  const ref = useRef<HTMLElement>();

  const moveScrollDown = useCallback(() => {
    const element = ref.current;
    element?.scrollTo(0, element.scrollHeight);
  }, []);

  useEffect(() => {
    moveScrollDown();
  }, [moveScrollDown]);

  const postListDom = ref.current;

  let isShownDownButton = false;

  if (postListDom) {
    isShownDownButton = postListDom.scrollHeight > postListDom.offsetHeight;
  }

  return (
    <Stack
      gap="10px"
      ref={ref}
      sx={{
        position: 'relative',
        flexGrow: 1,
        borderBottom: '3px solid #000',
        fontFamily: 'Inter',
        fontStyle: 'normal',
        overflowY: 'auto',
      }}
    >
      {discussion
        ? discussion.posts.map((post, index) => (
          <Fragment key={post.id}>
            <Post post={post} />

            {/* Consider last post divider component */}
            {index !== discussion.posts.length - 1 && (
              <Divider sx={{ borderColor: '#000', marginTop: '10px' }} />
            )}
          </Fragment>
        ))
        : null}
      {
        isShownDownButton ? (
          <ScrollDownButton onClick={moveScrollDown} />
        ) : null
      }
    </Stack>
  );
}
