import React , {useEffect , useState} from "react";
import NewsItem from "./NewsItem";
import Spinner from "./Spinner";
import PropTypes from 'prop-types'
import InfiniteScroll from "react-infinite-scroll-component";



const News = (props) => {
  const[articles , setArticles] = useState([])
  const[loading , setLoading] = useState(true)
  const [page, setPage] = useState(1);
  const [totalResults, setTotalResults] = useState(0);
  

 const capitalizeFirstLetter = (string) =>{
    return string.charAt(0).toUpperCase() + string.slice(1);

  }

  const updateNews = async() =>{
   props.setProgress(10);

    let url = `https://newsapi.org/v2/top-headlines?country=${props.country}&category=${props.category}&apiKey=${props.apiKey}&page=${page}&pageSize=${props.pageSize}`;

    setLoading(true);
    
    let data =  await fetch(url);
    props.setProgress(30);
    let parsedData = await data.json()
    props.setProgress(70);
    setArticles(parsedData.articles);
    setTotalResults(parsedData.totalResults);
    setLoading(false);

    props.setProgress(100);

  }

  useEffect(() => {
    document.title = `${capitalizeFirstLetter(props.category)} - NewsMonkey` 
    updateNews();
  }, []);


  const handlePrevClick = async()=>{
    console.log("prev clicked");
    setPage(page - 1);
    updateNews();
  //   let url = `https://newsapi.org/v2/top-headlines?country=${props.country}&category=${props.category}&apiKey=131c8bc8bb0e4117817bf9c58b599b40&page=${this.state.page - 1}&pageSize=${props.pageSize}`;
  //   this.setState({loading:true});
    
  //   let data =  await fetch(url);
  //   let parsedData = await data.json();
   

  //   this.setState({
  //     page: this.state.page - 1,
  //     articles: parsedData.articles,
  //     loading:false
  // })
}

  const handleNextClick = async() => {
    console.log("next clicked");
    this.setState({page:this.state.page + 1})
     updateNews();

     setPage(page + 1);

//     if((this.state.page + 1 > Math.ceil(this.state.totalResults / props.pageSize))){

//     }
// else{
//     let url = `https://newsapi.org/v2/top-headlines?country=${props.country}&category=${props.category}&apiKey=131c8bc8bb0e4117817bf9c58b599b40&page=${this.state.page + 1}&pageSize=${props.pageSize}`;
//     this.setState({loading: true});
    
//     let data =  await fetch(url);
//     let parsedData = await data.json();
   
//     this.setState({
//       page: this.state.page + 1,
//       articles: parsedData.articles,
//       loading:false
//     })

//   }

  }

  const fetchMoreData = async() => {
    setPage(page + 1);
    let url = `https://newsapi.org/v2/top-headlines?country=${props.country}&category=${props.category}&apiKey=${props.apiKey}&page=${page + 1}&pageSize=${props.pageSize}`;
    // this.setState({loading:true});
    
    let data =  await fetch(url);
    let parsedData = await data.json()
    setArticles(articles.concat(parsedData.articles))
    setTotalResults(parsedData.totalResults)
   
  };

    return (
      <div className="container my-3">
        <h1 className="text-center" style={{margin:'40px 0px' , marginTop:'90px'}}>NewsMonkey - Top {capitalizeFirstLetter(props.category)} Headlines </h1>
       {loading && <Spinner/>}
       <InfiniteScroll
       dataLength={articles.length}
       next = {fetchMoreData}
       hasMore = {articles.length !== totalResults}
       loader = {<Spinner/>}
       >
       

        <div className="row">
          {articles.map((element) => {
            return (
              <div className="col-md-4" key={element.url}>
                <NewsItem
                  title={element.title?element.title.slice(0 , 44):""}
                  description={element.description?element.description.slice(0,88):""}
                  imageUrl={element.urlToImage}
                  newsUrl = {element.url}
                  author = {element.author}
                  date = {element.publishedAt}
                />
              </div>
            );
          })}
        </div>
        </InfiniteScroll>
        {/* <div className="container d-flex justify-content-between">
        <button disabled = {this.state.page <= 1} type="button" className="btn btn-dark" onClick={this.handlePrevClick}>&larr; Previous</button>
        <button disabled = {this.state.page + 1 > Math.ceil(this.state.totalResults / props.pageSize)} type="button" className="btn btn-dark" onClick={this.handleNextClick}>Next &rarr;</button>
        </div> */}
      </div>
    );
}

News.defaultProps = {
  country: 'in',
  pageSize: 8,
  category: 'general'
}

News.propTypes = {
  country: PropTypes.string,
  pageSize: PropTypes.number,
  category: PropTypes.string

}

export default News;
