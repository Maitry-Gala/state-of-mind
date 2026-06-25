import { Button } from "../components/ui/Button"
import { Card } from "../components/ui/Card"
import { Plus } from "../components/icons/Plus"
import { ShareIcon } from "../components/icons/ShareIcon"
import {CreateContentModal} from"../components/model/CreateContentModel"
import { useState } from "react"
import { Sidebar } from "../components/asidebar/Slidebar"


export function Dashboard() {
  const [modalOpen, setModalOopen] = useState(false);

  return <div>
    <Sidebar/> 

    <div className="p-4 ml-72 min-h-screen bg-gray-100">
    <CreateContentModal open ={modalOpen} onClose={ () => {setModalOopen(false)}}/>
      <div className="flex justify-end gap-4">
        <Button variant="primary" text="Share Brain" disabled={false} startIcon={<ShareIcon/>}></Button>

        <Button variant="secondary"  onClick={() => {setModalOopen(true)}} text="Add Content" disabled={false} startIcon={<Plus/>}></Button>
      </div>

      <div className="flex gap-4 items-start">
      
          <Card title="Cool Tweet" url="https://x.com/kirat_tw/status/2039031795283526111" type="article" />
      
        <Card title="Cool Video" url="https://www.youtube.com/watch?v=xwhJfqIyoBY" type="video" />
        

      </div>
    </div>
  </div>
}

 