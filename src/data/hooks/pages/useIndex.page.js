import { useApi } from '../useApi';
import { mutate } from 'swr';
import { useState, useMemo } from 'react';
import { ApiService } from '../../services/ApiService';

export function useIndex() {
    const maxTextLength = 125,
        user = {
            name: 'Felipe Azevedo',
            username: 'felipeazsantos',
            picture: 'https://github.com/felipeazsantos.png'
        },
        [text, setText] = useState(''),
        tweetList = useApi('tweets').data,
        sortedTweetList = useMemo(() => {
            return (tweetList || []).sort((a, b) => (a.data.date < b.data.date ? 1 : -1))
        }, [tweetList]);

    function onTextChange(event) {
        const text = event.target.value;
        if (text.length <= maxTextLength) {
            setText(text);
        }
    }

    async function sendTweet() {
        await ApiService.post('tweets', {
            data: {
                user,
                text,
                date: new Date().toISOString()
            }
        })
        setText('');
        mutate('tweets');
    }

    return {
        user,
        text,
        onTextChange,
        maxTextLength,
        sendTweet,
        sortedTweetList
    }
}