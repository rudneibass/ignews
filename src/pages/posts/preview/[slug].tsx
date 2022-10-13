import {  GetStaticPaths, GetStaticProps } from "next"
import { useSession } from "next-auth/react"
import Head from "next/head"
import Link from "next/link"
import { useRouter } from "next/router"
import { RichText } from "prismic-dom"
import { useEffect } from "react"
import { getPrismicClient } from "../../../services/prismic"


import styles from  '../post.module.scss'

interface PostPreviewProps {
    post: {
        slug: string,
        title: string,
        content: string,
        updatedAt: string,
    }
}

export default function PostPreview({post}: PostPreviewProps){
    const {data: session} = useSession()
    const router = useRouter()


    useEffect(() => {
        if(session?.activeSubscription){
            router.push(`/posts/${post.slug}`)
        }
    }, [session])

    return(
        <>
            <Head>
                <title>{post.title} | Ignews</title>
            </Head>
            <main className={styles.container}>
                <article className={styles.post}>
                    <h1>{post.title}</h1>
                    <time>{post.updatedAt}</time>
                    <div className={`${styles.postContent} ${styles.previewContent}`} dangerouslySetInnerHTML={{__html: post.content}}   />

                    <div className={styles.continueReading}>
                        Wanna continue reading? 
                        <Link href="/">
                            <a>Subscribe now 🤗</a>
                        </Link>
                    </div>
                </article>
            </main>
        </>
        
    )
}

// Gera as páginas estaticas durante o build de acordo com o array 'paths' (SSG)
export const getStaticPaths: GetStaticPaths = async () => {
    return {
        paths: [{ params: {slug: 'comunidade-guia-pratico-de-como-contribuir-para-o'}}], //array de paginas estaticas
        fallback: 'blocking'
    }
}

// Para que todas as páginas sejam geradas dinamicamente basta dexar o arry 'paths' vazio
// Nas duas situações a função getStaticPaths precisa existir quando a página é construida com  getStaticProps()
/* export const getStaticPaths: GetStaticPaths = async () => {
    return {
        paths: [],
        fallback: 'blocking'
    }
} */


 // fallback: 
 // false: retorna um 404 quando a página estática não existe no servidor
 // true: Carrega o layout da página e executa o getStaticProps() para buscar os dados da página, o que gera um layout shift
 // blocking: Só carrega a página quando o layout e os dados estão prontos




export const getStaticProps: GetStaticProps = async ({params}) => {
    const { slug } = params

    const prismic = getPrismicClient()
    const response = await prismic.getByUID('publication', String(slug), {}) 
    
    const post = {
        slug,
        title: RichText.asText(response.data.title),
        content: RichText.asHtml(response.data.content.splice(0, 3)),
        updatedAt: new Date(response.last_publication_date).toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: 'long',
            year: 'numeric'
        })
    }

    return {
        props: {
            post,
        },
        revalidate: 30 * 60 // 30 minutos
    }
}