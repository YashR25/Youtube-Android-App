import TrackPlayer, {
  AppKilledPlaybackBehavior,
  Capability,
  Event,
  RepeatMode,
  Track,
} from 'react-native-track-player';
import {videoInterface} from '../interfaces/video';

export async function setupPlayer() {
  let isSetup = false;
  try {
    await TrackPlayer.getActiveTrack();
    await TrackPlayer.play();
    isSetup = true;
  } catch (error) {
    await TrackPlayer.setupPlayer();
    await TrackPlayer.play();
    await TrackPlayer.updateOptions({
      android: {
        appKilledPlaybackBehavior:
          AppKilledPlaybackBehavior.StopPlaybackAndRemoveNotification,
      },
      capabilities: [
        Capability.Play,
        Capability.Pause,
        Capability.JumpBackward,
        Capability.JumpForward,
      ],
      compactCapabilities: [
        Capability.Play,
        Capability.Pause,
        Capability.JumpBackward,
        Capability.JumpForward,
      ],
      // progressUpdateEventInterval: 2,
    });
    isSetup = true;
  } finally {
    return isSetup;
  }
}

export async function addTrack(video: videoInterface) {
  // const currentTrack = await TrackPlayer.getActiveTrack();
  // if (currentTrack) {
  //   await TrackPlayer.remove([0]);
  // }

  await TrackPlayer.add({
    id: video._id,
    title: video.title,
    artist: video.owner.username,
    artwork: video.thumbnail.url,
    url: video.videoFile.url,
    duration: parseFloat(video.duration),
  });
  // await TrackPlayer.setRepeatMode(RepeatMode.Queue);
}

export async function altAddTrack(videos: videoInterface[]) {
  // const currentTrack = await TrackPlayer.getActiveTrack();
  // if (currentTrack) {
  //   await TrackPlayer.remove([0]);
  // }

  const videoData = videos.map(video => {
    return {
      id: video._id,
      title: video.title,
      artist: video.owner.username,
      artwork: video.thumbnail.url,
      url: video.videoFile.url,
      duration: parseFloat(video.duration),
    };
  });

  await TrackPlayer.add(videoData);

  await TrackPlayer.setRepeatMode(RepeatMode.Queue);
}

export async function playbackService() {
  TrackPlayer.addEventListener(Event.RemotePause, () => {
    TrackPlayer.pause();
  });

  TrackPlayer.addEventListener(Event.RemotePlay, () => {
    TrackPlayer.play();
  });

  TrackPlayer.addEventListener(Event.RemoteNext, () => {
    TrackPlayer.skipToNext();
  });

  TrackPlayer.addEventListener(Event.RemotePrevious, () => {
    TrackPlayer.skipToPrevious();
  });
}
