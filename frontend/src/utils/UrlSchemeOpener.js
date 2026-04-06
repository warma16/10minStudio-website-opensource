export default async (url) => {
    let iframe = document.createElement("iframe");
    iframe.src = link;
    iframe.style.display = "none";
    iframe.onload = function(){
        document.body.removeChild(iframe);
    }
     document.body.appendChild(iframe);
}