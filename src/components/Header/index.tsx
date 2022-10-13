import { SignInButton } from '../SignInButton/index';
import styles from './styles.module.scss'
import Link from 'next/link';
import Image from 'next/image';
import { ActiveLink } from '../ActiveLink';

export function Header(){
    
    return(
        <header className={styles.headerContainer}>
            <div className={styles.headerContent}>
                <img src="/images/logo.svg" alt="ig.news" />
                <nav>
                    <ActiveLink activeClassName={styles.active} href="/">
                        <a className={styles.active}>Home</a>
                    </ActiveLink>
                    <ActiveLink activeClassName={styles.active} href="/posts" prefetch>
                        <a>Posts</a>
                    </ActiveLink>
                    
                </nav>
                <SignInButton />
            </div>
        </header>
    );
}