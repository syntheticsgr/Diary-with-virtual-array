const styles = {
  container: {
    backgroundColor: '#fafafa',
    padding: 25,
    cursor: 'move',
    minHeight: 200
  },
  slideContainer: {
    display: 'flex',
    justifyContent: 'center',
    overflow: 'hidden',
    height: 150,
  },
  root: {
    padding: '0px 38%',
    margin: '0px 25px',
    overflow: 'hidden',
  },
  slide: {
    color: '#333',
    cursor: 'pointer',
    padding: 10,
    opacity: 0.5,
    borderTop: 'solid 5px #fff',
    transition: 'opacity 500ms ease-in-out, border-top 500ms ease-in-out',
  },
  section: {
    height: '55px',
    marginTop: 5,
    border: '#aaa 1px solid',
    padding: 5,
    cursor: 'pointer',
    backgroundColor: '#fafafa',
  },
  emptySection: {
    display: 'flex',
    justifyContent: 'center',
    marginTop: 15,
    cursor: 'pointer',
    backgroundColor: '#82b1ff',
    color: '#fff',
  },
  selector: {
    //backgroundColor: '#82b1ff',
    padding: 5,
    color: '#333',
  },
  p: {
    paddingLeft: 0,
    margin: 0,
  },
  h: {
    paddingLeft: 0,
    margin: '0px 0px 5px 0px',
  },
  plus: {
    position: 'absolute',
    top: 80,
    right: 25,
    padding: 20,
    backgroundColor: '#555',
    color: '#fff',
    fontSize: 25,
    cursor: 'pointer',
  },
  minus: {
    left: 25,
    right: 'none',
  },
};

export default styles
