import React, { useEffect, useCallback } from 'react'
import ListOfCards from '../ListOfCards'
import usePexels from '../../hooks/usePexels'
import GridLoader from '../GridLoader'
import useNearScreen from '../../hooks/useNearScreen'
import debounce from 'just-debounce-it'
import { Redirect } from 'wouter'

export default function PexelsResults({ params }) {
  let { keyword } = params
  if (!keyword) keyword = 'Nature'
  const { loading, error, globalPexels, page, setPage } = usePexels({
    keyword,
  })
  const { isNearScreen, ref } = useNearScreen({
    distance: '400px',
    once: false,
  })

  const handleNextPage = useCallback(
    debounce(() => {
      setPage((prevPage) => prevPage + 1)
    }, 200),
    []
  )

  useEffect(() => {
    isNearScreen && handleNextPage()
  }, [handleNextPage, isNearScreen])

  if (error) return <Redirect to='/404' />

  if (loading && page === 1) return <GridLoader />
  else if (loading && page > 1) {
    return (
      <>
        <ListOfCards globalPexels={globalPexels} />
        <GridLoader />
      </>
    )
  } else {
    return (
      <>
        <ListOfCards globalPexels={globalPexels} />
        <div id='visor' ref={ref}></div>
      </>
    )
  }
}
