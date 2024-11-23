const handleMessage = (event: MessageEvent) => {
    console.log('Received message from iframe:', event.data);

    try {
      const data = JSON.parse(event.data);

      if (data.action === 'requestToken') {
        console.log('Iframe requested token and game_id');
        // 发送 token 和 game_id 给 iframe
        if (iframeRef.current) {
          iframeRef.current.contentWindow?.postMessage(
            JSON.stringify({ token:'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJkZXYiLCJpYXQiOjE3MzA3OTI2MjksImV4cCI6MTc2MjMyODYyOSwibmJmIjoxNzMwNzkyNjI5LCJ1aWQiOiIxIn0.9fNn-vU0Gx600revlw4dp96eU1szJnqvA_vK5-Eg7r8', game_id: gameId }),
            '*', // 支持跨域
          );
        }
      }
    } catch (error) {
      console.error('Error parsing iframe message:', error);
    }
  };

  // 添加事件监听器
  window.addEventListener('message', handleMessage);

  return () => {
    // 移除事件监听器
    window.removeEventListener('message', handleMessage);
  };