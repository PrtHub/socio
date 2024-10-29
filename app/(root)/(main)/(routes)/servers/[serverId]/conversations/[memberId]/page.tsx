

const MemberIdPage = ({ params }: { params: { serverId: string; memberId: string } }) => {
  return (
    <div>
      Member Id: {params.memberId}
    </div>
  )
}

export default MemberIdPage
