import { useEffect, useState } from 'react'
import './App.css'
import useBookmarks, { Bookmark } from './data/bookmarks'
import { LinkCard } from './components/linkCard'
import { Badge } from './components/ui/badge'
import { Input } from './components/ui/input'
import { Drawer, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger } from './components/ui/drawer'
import { ScrollArea } from './components/ui/scroll-area'

function App() {
  const { bookmarks, tags, tag, setTag, search, setSearch } = useBookmarks();

  const [recBookmarks, setRec] = useState<Bookmark[]>([]);

  useEffect(() => {
    if (!bookmarks) return;
    // pick 10 random bookmarks from recs
    const recsCount = bookmarks.length;
    if (recsCount > 4) {
      const randomIndexArray = Array.from({ length: 4 }, (_) => {
        const randomIndex = Math.floor(Math.random() * recsCount);
        return randomIndex;
      })
      const _result = randomIndexArray.map((index) => {
        return bookmarks[index];
      }
      );
      setRec(_result);
    } else {
      setRec(bookmarks);
    }
  }
    , [bookmarks]);

  return (
    <div>
      <header className='border-grid sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60'>
        {/* search  */}
        <div className='p-2 mx-auto flex flex-row items-center' style={{ 'maxWidth': '1200px' }}>
          <div className='flex-1'>
            <h1 className='text-2xl font-bold'>BookmarkNav</h1>
            <p className='text-sm text-gray-500'>一个简单的书签导航网站</p>
          </div>
          <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder='搜索' className='inline-flex items-center gap-2 whitespace-nowrap transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 border border-input hover:bg-accent hover:text-accent-foreground px-4 py-2 relative h-8 w-full justify-start rounded-[0.5rem] bg-muted/50 text-sm font-normal text-muted-foreground shadow-none sm:pr-12 ml-4' />
        </div>

      </header>


      <div className='bg-gray-800' style={{ 'minHeight': '200px' }}>
        <div className='p-2 pt-6 mx-auto' style={{ 'maxWidth': '1200px' }} >
          {
            recBookmarks.length > 0 && <div className="rec ml-2" >
              <div className="rec-title mb-2 text-lg text-white">
                推荐
              </div>
              <div className='flex-1 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2'>
                {
                  recBookmarks.map((bookmark) => (
                    <div className='mb-2'>
                      <LinkCard link={bookmark} key={'rec' + bookmark.id} />
                    </div>
                  ))
                }
              </div>
            </div>
          }
        </div>
      </div>
      <div className='p-2 mx-auto' style={{ 'maxWidth': '1200px' }} >

        <div className='flex flex-col'>

          <div className='mb-2'>
            <h2 className='text-lg text-white'>
              {tag ? `标签: ${tag}` : '所有书签'}
            </h2>
            <p className='text-sm text-gray-500'>
              {bookmarks.length} 个书签
            </p>
          </div>

          <div className='mb-2'>
            {
              tags.slice(0, 10).map((_tag) => (
                <Badge
                  key={_tag.tag}
                  onClick={() => setTag(_tag.tag)}
                  variant={tag == _tag.tag ? 'outline' : 'default'}
                  className='m-1 cursor-pointer'
                >
                  {_tag.tag} ({_tag.count > 0 ? _tag.count : ''})
                </Badge>
              ))

            }
            <Drawer>
              <DrawerTrigger>            <Badge className='m-1 cursor-pointer' onClick={() => { }}>更多</Badge>
              </DrawerTrigger>
              <DrawerContent>
                <DrawerHeader>
                </DrawerHeader>
                <ScrollArea className='flex flex-row flex-wrap h-[500px]'>
                {
                  tags.filter(tag=>tag.count>10).map((_tag) => (
                    <Badge
                      key={_tag.tag}
                      onClick={() => {
                        setTag(_tag.tag)
                      }}
                      variant={tag == _tag.tag ? 'outline' : 'default'}
                      className='m-1 cursor-pointer'
                    >
                      {_tag.tag} ({_tag.count > 0 ? _tag.count : ''})
                    </Badge>
                  ))

                }
                </ScrollArea>
                <DrawerFooter>
                </DrawerFooter>
              </DrawerContent>
            </Drawer>

          </div>

          <div className='flex-1 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2'>
            {
              bookmarks.map((bookmark) => (
                <LinkCard link={bookmark} key={bookmark.id} />
              ))
            }
          </div>

        </div>
      </div>
    </div>
  )
}

export default App
