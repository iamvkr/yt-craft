export const getChannelInfo = async (inputUrl: string) => {
  try {
    let initdata: any = {}; // eslint-disable-line @typescript-eslint/no-explicit-any
    const response = await fetch(inputUrl + "?app=desktop");
    const resDATA = await response.text();

    const ytInitData = resDATA.split("var ytInitialData =");
    if (ytInitData && ytInitData.length > 1) {
      const data = ytInitData[1].split("</script>")[0].slice(0, -1);
      initdata = JSON.parse(data);
      const channelId: string =
        initdata.metadata.channelMetadataRenderer.externalId;
      const title: string = initdata.metadata.channelMetadataRenderer.title;
      const channelImage: string =
        initdata.metadata.channelMetadataRenderer.avatar.thumbnails[0].url;
      return { channelId, title, channelImage };
    } else {
      return false;
    }
  } catch (error) {
    console.log((error as Error).message);
    return false;
  }
};
