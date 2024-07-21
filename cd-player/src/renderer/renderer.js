// window.myAPI.test()




document.addEventListener('DOMContentLoaded', async () => {
    window.mci.openCd()
    try {
        window.document.querySelector("#track-count").innerText = await window.mci.getTrackCount()
    } catch(e) {
        console.error("e")
    }
    
    window.mci.closeCd()
});