import { useEffect } from 'react'
import { socket } from '../utils/socket'

export function useSocket(event: string, callback: (data: any) => void) {
  useEffect(() => {
    const handler = (data: any) => callback(data)
    socket.on(event, handler)

    return () => {
      socket.off(event, handler)
    }
  }, [event, callback])
}
