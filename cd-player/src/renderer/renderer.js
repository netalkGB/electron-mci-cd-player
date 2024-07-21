// window.myAPI.test()




document.addEventListener('DOMContentLoaded', async () => {
    await window.mci.openCd()
    try {
        window.document.querySelector("#track-count").innerText = await window.mci.getTrackCount()
    } catch(e) {
        console.error(e)
    }
    
    await window.mci.closeCd()
});