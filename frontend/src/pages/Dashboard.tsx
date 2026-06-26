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
        <Card title="Cool Video" url="https://i.pinimg.com/736x/cf/7f/61/cf7f617e6271366cdea7264aee4dfc9d.jpg" type="image" />
        <Card title="Cool Video" url="https://soundcloud.com/justicehardcore/feelslikeheaven?utm_source=clipboard&utm_medium=text&utm_campaign=social_sharing" type="audio" />
        

      </div>
    </div>
  </div>
}

 