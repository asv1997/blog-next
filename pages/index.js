import styled from "styled-components";

const Container = styled.div`
  height: 100%;
  width: 100%;
  display: flex;
  align-items: center;
  flex-direction: column;
`

const BlogDescription = styled.p`
  margin-top: 8px;
  font-size: 16px;
  color: lightcyan;
  font-weight: bold;
  max-width: 50%;
`

const HtmlContainer = styled.div`
  min-height: 400px;
  width: 60%;
  margin-top: 30px;
  padding: 20px;
  overflow: hidden;
  border: 0.5px solid lightslategrey;
  img{
    max-height: 200px;
    width: 50%;
  }
`

const Author = styled.p`
  margin-top: 25px;
  font-size: 14px;
  color: lightcyan;
  font-weight: bold;
  max-width: 50%;
`

const aws_path = "vignesh-strapi-assets.s3.ap-south-1.amazonaws.com";
const imgix_path = "imgix-test-asv.imgix.net";

function Home({blog}) {

    if(!blog.data) {
        return <Container>
            <h1>Something went wrong</h1>
        </Container>
    }

   const {blog_title, blog_description, blog_content, mentors} = blog.data.attributes
   const regex = /['""]https:\/\/vignesh-strapi-assets.s3.ap-south-1.amazonaws.com(.*)['"]/g;
   const _blog_content = blog_content.replace( regex, ( ...args ) => {
       return '"https://imgix-test-asv.imgix.net' + args[ 1 ] + '?q=35&auto=format"'
   })

   const mentorName = mentors?.data[0]?.attributes['mentor_details'][0]['mentor_name'];
   return (
      <Container>
        <h1>{blog_title}</h1>
        <BlogDescription>{blog_description}</BlogDescription>
        <HtmlContainer  dangerouslySetInnerHTML={{ __html: _blog_content }}/>
        <Author>Article written by : {mentorName}</Author>
      </Container>
  )
}

export async function getStaticProps() {

    const res = await fetch('http://13.235.33.68:1337/api/blogs/2?populate[mentors][populate][0]=mentor_details')
    const blog = await res.json()

    // By returning { props: { posts } }, the Blog component
    // will receive `posts` as a prop at build time
    return {
        props: {
            blog,
        },
        revalidate: 60
    }
}

export default Home;
