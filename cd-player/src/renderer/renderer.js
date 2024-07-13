// window.myAPI.test()




document.addEventListener('DOMContentLoaded', async () => {
    await window.mci.openCd()
    window.document.querySelector("#track-count").innerText = await window.mci.getTrackCount()
    await window.mci.closeCd()
});