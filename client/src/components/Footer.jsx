export default function Footer() {
  return (
    <div className="container" style={{
      position: 'relative',
      flexShrink: 0, /* Prevent footer from shrinking */
      marginTop: 'auto', /* Push footer to the bottom */
      left: 0,
      bottom: 0,
      width: '100%'
    }}>
      <footer className="py-3 my-4">
        <ul className="nav justify-content-center border-bottom pb-3 mb-3">
          {/* <li className="nav-item"><a href="#" className="nav-link px-2 text-muted">ارتباط با ما</a></li> */}
          {/* <li className="nav-item"><a href="#" className="nav-link px-2 text-muted">درباره ما</a></li> */}
        </ul>
        <p dir='ltr' className="text-center text-muted">© 2023 H.LAN</p>
      </footer>
    </div>
  )
}

