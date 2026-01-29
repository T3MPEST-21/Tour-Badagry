'use client'

import { login, signup } from './actions'
import styles from './login.module.css'
import { useState } from 'react'

export default function LoginPage() {
    const [isLogin, setIsLogin] = useState(true);

    return (
        <div className={styles.loginPage}>
            <div className={`glass-panel ${styles.container}`}>
                <h1 className="text-gradient" style={{ textAlign: 'center', marginBottom: '20px' }}>
                    {isLogin ? 'Operator Login' : 'Create Account'}
                </h1>
                
                <form className={styles.form}>
                    {!isLogin && (
                        <div className={styles.inputGroup}>
                            <label htmlFor="fullName">Full Name</label>
                            <input id="fullName" name="fullName" type="text" required />
                        </div>
                    )}
                    <div className={styles.inputGroup}>
                        <label htmlFor="email">Email</label>
                        <input id="email" name="email" type="email" required />
                    </div>
                    <div className={styles.inputGroup}>
                        <label htmlFor="password">Password</label>
                        <input id="password" name="password" type="password" required />
                    </div>
                    
                    {isLogin ? (
                        <button formAction={login} className="btn-primary" style={{ width: '100%' }}>Log In</button>
                    ) : (
                        <button formAction={signup} className="btn-primary" style={{ width: '100%' }}>Sign Up</button>
                    )}
                </form>

                <div className={styles.toggle}>
                    <p>
                        {isLogin ? "Don't have an account? " : "Already have an account? "}
                        <button onClick={() => setIsLogin(!isLogin)} className={styles.toggleBtn}>
                            {isLogin ? 'Sign Up' : 'Log In'}
                        </button>
                    </p>
                </div>
            </div>
        </div>
    )
}
