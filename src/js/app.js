class CreatMsg {
  constructor() {
    this.messageInput = document.querySelector(".msg");
    this.form = document.querySelector(".input-form");
    this.chatContent = document.querySelector(".shats-content");
    this.videoIcon = document.querySelector(".video-icon");
    this.audioIcon = document.querySelector(".audio-icon");
  }
  async geolocation() {
    const cord = await new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(resolve, reject);
    });
    return {
      geo:
        "[ " +
        cord.coords.longitude.toFixed(5) +
        " - " +
        cord.coords.latitude.toFixed(5) +
        " ] ",
    };
  }
  time() {
    return new Date(Date.now()).toTimeString().slice(0, 5);
  }
  video() {
    this.videoIcon.addEventListener("click", (e) => {
      let video = document.createElement("video");
      let send = document.createElement("send");
      send.classList.add("send");
      let mediaBody = document.querySelector(".media-body");

      video.classList.add("video");
      this.chatContent.insertAdjacentHTML(
        "afterbegin",
        ` <div сlass="video-wrp">
         <video class="video" controler></video>
          </div>`
      );

      const videoPlayer = document.querySelector(".video");
      (async () => {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: true,
          video: true,
        });

        videoPlayer.srcObject = stream;

        videoPlayer.addEventListener("canplay", () => {
          videoPlayer.play();
        });

        const recorder = new MediaRecorder(stream);
        const chunks = [];

        recorder.start();
        recorder.onstart = function () {
          videoPlayer.style = "border:1px solid red";
        };
        this.videoIcon.style.display = "none";
        mediaBody.appendChild(send);

        recorder.addEventListener("dataavailable", (event) => {
          chunks.push(event.data);
        });

        recorder.addEventListener("stop", () => {
          const blob = new Blob(chunks);
          let videoRecorded = document.createElement("video");
          videoRecorded.classList.add("msg-video");
          videoRecorded.src = URL.createObjectURL(blob);
          // videoRecorded.controls = true;
          videoRecorded.autoplay = true;
          videoRecorded.loop = true;
          videoRecorded.volume = 0;
          this.chatContent.appendChild(videoRecorded);
          this.volumeOn();
        });

        send.addEventListener("click", () => {
          recorder.stop();
          videoPlayer.remove();
          stream.getTracks().forEach((track) => track.stop());
          this.videoIcon.style.display = "block";
          send.remove();
        });
      })();
    });
  }
  volumeOn() {
    let msgVideo = document.querySelectorAll(".msg-video");

    msgVideo.forEach((element) => {
      element.addEventListener("click", (e) => {
        if (e.target.volume == 0) {
          e.target.volume = 1;
          console.log(e.target.volume);
        } else {
          e.target.volume = 0;
        }
      });
    });
  }
  audio() {
    this.audioIcon.addEventListener("click", (e) => {
      let audio = document.createElement("audio");
      let send = document.createElement("send");
      send.classList.add("send");
      let mediaBody = document.querySelector(".media-body");

      audio.classList.add("audio");
      this.chatContent.insertAdjacentHTML(
        "afterbegin",
        ` 
        <audio class="audio" controls>
        </audio>
          `
      );
      const audioPlayer = document.querySelector(".audio");

      (async () => {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: true,
        });

        audioPlayer.srcObject = stream;

        audioPlayer.addEventListener("canplay", () => {
          audioPlayer.play();
        });

        const recorder = new MediaRecorder(stream);
        const chunks = [];

        recorder.start();
        recorder.onstart = function () {
          console.log("start recording");
        };
        this.audioIcon.style.display = "none";
        mediaBody.appendChild(send);
        recorder.addEventListener("dataavailable", (event) => {
          chunks.push(event.data);
          console.log("recording");
        });
        recorder.addEventListener("stop", () => {
          const blob = new Blob(chunks);
          let audioRecorded = document.createElement("audio");
          audioRecorded.classList.add("msg-audio");
          audioRecorded.src = URL.createObjectURL(blob);
          audioRecorded.controls = true;
          this.chatContent.appendChild(audioRecorded);
        });
        send.addEventListener("click", () => {
          recorder.stop();
          audioPlayer.remove();
          stream.getTracks().forEach((track) => track.stop());
          this.audioIcon.style.display = "block";
          send.remove();
        });
      })();
    });
  }
  getMessage() {
    this.form.addEventListener("submit", async (event) => {
      event.preventDefault();
      let msgContent = event.target.querySelector(".msg").value;
      this.chatContent.insertAdjacentHTML(
        "afterbegin",
        ` <div class="msg-item">
                               ${msgContent}
                              <span class="geo"> ${(await this.geolocation()).geo
        }</span>
                              <time class="msg-time"> ${this.time()}</time>
                                   </div>`
      );

      msgContent = "";
      this.form.reset();
    });
  }
}
document.addEventListener("DOMContentLoaded", function () {
  const creatMsg = new CreatMsg();
  creatMsg.getMessage();
  creatMsg.video();
  creatMsg.audio();
});
