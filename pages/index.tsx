import styles from '@/styles/Home.module.css';
import { FormEvent, useRef, useState } from 'react';
import axios, { AxiosResponse, AxiosError } from 'axios';
import toast, { Toaster } from 'react-hot-toast'


export default function Home() {

  const wordInputRef = useRef<HTMLInputElement>(null)
  const [deletedWord, setDeletedWord] = useState<string>("")

  // toast is a popup message/notification library

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    // check for empty input
    if (wordInputRef.current?.value === "") {
      toast.error("The input cannot be empty")
      return
    }

    axios.post('https://words.boondoc.co/words', wordInputRef.current?.value, {
      headers: {
        'Content-Type': 'text/plain'
      }
    }).then((response: AxiosResponse) => {
      if (response.status === 201) {
        toast.success(`"${wordInputRef.current?.value}" successfully added!`)
      }
    }).catch((error: AxiosError) => {
      // error handling
      if (error.response?.status === 503) {
        toast.error("Word collection full")
      } else if (error.response?.status === 400) {
        toast.error("Invalid input")
      } else if (error.response?.status === 500) {
        toast.error("Unknown error")
      } else {
        toast.error("Unexpected error")
      }
    })
  }

  const handleClick = () => {
    axios.delete('https://words.boondoc.co/words', {
      headers: {
        'Content-Type': 'text/plain'
      }
    }).then((response: AxiosResponse) => {
      if (response.status === 200) {
        toast.success(`"${response.data}" successfully deleted!`)
        setDeletedWord(response.data)
      }
    }).catch((error: AxiosError) => {
      // error handling
      if (error.response?.status === 404) {
        toast.error("Word collection is empty")
      } else {
        toast.error("Unexpected error")
      }
    })
  }

  return (
    <div className={styles.mainContainer}>
      <Toaster position="top-right" toastOptions={{ duration: 1500 }} />
      <div className={styles.navbar}> Words! </div>
      <div className={styles.resultContainer}>
        <form className={styles.submitWordForm} onSubmit={handleSubmit}>
          <input ref={wordInputRef} type="text" placeholder="Enter a word:" className={styles.input} />
          <button type="submit" className={styles.submitButton}> Submit </button>
        </form>
        <div className={styles.deletedWordContainer}>
          <button className={styles.deleteButton} onClick={handleClick}> Delete a Word </button>
          {deletedWord && <div className={styles.deletedWord}> {deletedWord} </div>}
        </div>
      </div>
    </div>
  )
}

