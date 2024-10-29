

const ChannelIdPage = ({ params }: { params: { serverId: string; channelId: string } }) => {
  return (
    <div>
      Channel Id: {params.channelId}
      Server Id: {params.serverId}
    </div>
  )
}

export default ChannelIdPage
