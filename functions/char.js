exports.makeUrl = (title) => {
  try{
    let chars = {
      '#': '-',
      '?': '-',
      ' ': '-',
      '/': '',
    }
    // please add below the char u add above
    let url = (title = title.replace(/[#? /]/g, (m) => chars[m]))
    return url
  }catch(err){
    return ''
  }
}
