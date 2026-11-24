"use client"

import { useState } from "react"
import axios from "axios"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import type { Message } from "@/src/models/user"
import { toast } from "@/components/ui/toast"

type MessageCardProps = {
  message: Message
  onMessageDelete: (messageId: string) => void
}

const MessageCard = ({ message, onMessageDelete }: MessageCardProps) => {
  const [isDeleting, setIsDeleting] = useState(false)
  const messageId = String(message._id)

  const handleDelete = async () => {
    setIsDeleting(true)

    try {
      const response = await axios.delete(`/api/delete-message/${messageId}`)
      toast.add({
        title: response.data.message ?? "Message deleted successfully.",
      })
      onMessageDelete(messageId)
    } catch (error) {
      const errorMessage = axios.isAxiosError(error)
        ? error.response?.data?.message
        : undefined

      toast.add({
        title: errorMessage ?? "Unable to delete the message. Please try again.",
        type: "error",
      })
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Message</CardTitle>
        <time
          className="text-sm text-muted-foreground"
          dateTime={new Date(message.createdAt).toISOString()}
        >
          {new Date(message.createdAt).toLocaleString()}
        </time>
      </CardHeader>
      <CardContent>
        <p className="whitespace-pre-wrap">{message.content}</p>
        <div className="mt-4 flex justify-end">
          <AlertDialog>
            <AlertDialogTrigger
              render={<Button variant="outline" disabled={isDeleting} />}
            >
              Delete
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete this message?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDelete}
                  disabled={isDeleting}
                >
                {isDeleting ? "Deleting..." : "Delete message"}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </CardContent>
    </Card>
  )
}

export default MessageCard
