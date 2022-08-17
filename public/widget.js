(function () {
  class Widget {
    constructor({ position = "bottom-right" } = {}) {
      this.position = this.getPosition(position);
      this.open = false;
      this.initialize();
      this.createStyles();
    }

    getPosition(position) {
      const [vertical, horizontal] = position.split("-");

      return {
        [vertical]: "30px",
        [horizontal]: "30px",
      };
    }

    initialize() {
      const container = document.createElement("div");
      container.style.position = "fixed";
      Object.keys(this.position).forEach((key) => {
        container.style[key] = this.position[key];
      });
      document.body.appendChild(container);

      const buttonContainer = document.createElement("div");
      buttonContainer.classList.add("button-container");

      const chatIcon = document.createElement("img");
      chatIcon.src = "assets/solana.svg";
      chatIcon.classList.add("icon");
      this.chatIcon = chatIcon;

      const closeIcon = document.createElement("img");
      closeIcon.src = "assets/close.svg";
      closeIcon.classList.add("icon", "hidden");
      this.closeIcon = closeIcon;

      this.messageContainer = document.createElement("div");
      this.messageContainer.classList.add("message-container", "hidden");

      this.createMessageContainerContent();

      buttonContainer.appendChild(this.chatIcon);
      buttonContainer.appendChild(this.closeIcon);

      buttonContainer.addEventListener("click", this.toggleOpen.bind(this));

      container.appendChild(this.messageContainer);
      container.appendChild(buttonContainer);
    }

    createStyles() {
      const styleTag = document.createElement("style");
      document.head.appendChild(styleTag);

      styleTag.innerHTML = `
          .icon {
              cursor: pointer;
              width: 70%;
              position: absolute;
              top: 9px;
              left: 9px;
              transition: transform .3s ease;
          }
  
          .hidden {
              transform: scale(0);
          }
  
          .button-container {
              background-color: #1a1a1a;
              width: 50px;
              height: 50px;
              border-radius: 50%;
  
          }
  
          .message-container {
              box-shadow: 0 0 10px rgba(0, 0, 0, .5);
              width: 400px;
              right: -25px;
              bottom: 75px;
              max-height: 400px;
              position: absolute;
              transition: max-height .3s ease;
              font-family: Helvetica, sans-serif;
          }
  
          .message-container.hidden {
              max-height: 0;
          }
  
          .message-container .content {
              margin: 20px 10px;
              border: 1px solid #1a1a1a;
              padding: 10px;
              display: flex;
              background-color: #fff;
              flex-direction: column;
          }
  
          .message-container h2 {
              margin: 0;
              padding: 20px;
              color: #fff;
              background-color: #3f51b5;
          }
  
          .message-container form * {
              margin: 5px 0;
          }
  
          .message-container form input {
              padding: 10px;
          }
  
          .message-container form textarea {
              padding: 10px;
              height: 100px;
          }
          
          .message-container form textarea::placeholder { 
              font-family: Helvetica, sans-serif;
          }
          .message-container form button { 
              cursor: pointer;
              background-color: #3f51b5;
              color: #fff;
              border: 0;
              border-radious: 4px;
              padding: 10px
          }
  
          .message-container form button:hover { 
              background-color: #303f9f;
          }
      `;
    }

    createMessageContainerContent() {
      this.messageContainer.innerHTML = ``;
      const title = document.createElement("h2");
      title.textContent = "Chose the amount";

      const form = document.createElement("form");
      form.classList.add("content");

      const radioboxPay1 = document.createElement("input");
      radioboxPay1.type = "radio";
      radioboxPay1.id = "pay1";
      radioboxPay1.value = "1";
      radioboxPay1.name = "pay";
      radioboxPay1.required = true;

      const labelPay1 = document.createElement("label");
      labelPay1.htmlFor = "pay1";
      const descriptionPay1 = document.createTextNode("1$");
      labelPay1.appendChild(radioboxPay1);
      labelPay1.appendChild(descriptionPay1);

      const newline = document.createElement("br");

      const radioboxPay5 = document.createElement("input");
      radioboxPay5.type = "radio";
      radioboxPay5.id = "pay5";
      radioboxPay5.value = "5";
      radioboxPay5.name = "pay";

      const labelPay5 = document.createElement("label");
      labelPay5.htmlFor = "pay5";
      const descriptionPay5 = document.createTextNode("5$");
      labelPay5.appendChild(radioboxPay5);
      labelPay5.appendChild(descriptionPay5);

      const btn = document.createElement("button");
      btn.textContent = "Donate";

      form.appendChild(labelPay1);
      form.appendChild(newline);
      form.appendChild(labelPay5);
      form.appendChild(btn);
      form.addEventListener("submit", this.submit.bind(this));

      this.messageContainer.appendChild(title);
      this.messageContainer.appendChild(form);
    }

    submit(event) {
      event.preventDefault();

      const amountToPay = document.querySelector(
        'input[name="pay"]:checked'
      ).value;

      const isPhantomInstalled = window.phantom?.solana?.isPhantom;
      if (isPhantomInstalled) {
        // LOOKING FOR A HERO TO IMPLEMENT THIS
        // The idea is to use phantom provider to sign the transaction and submit it via Solana JSON RPC connection,
        // so that the payment is handled on the website directly.
        // const provider = window.phantom?.solana;
        // const resp = provider.connect().then((response) => {
        // const publicKey = response.publicKey;
        // const connection = new Connection(network);
        // const transaction = new Transaction();
        // const { signature } = await provider.request({
        //  method: "signAndSendTransaction",
        // params: {
        //   message: bs58.encode(transaction.serializeMessage()),
        //},
        //});
      }

      window.open(
        `http://localhost:3000/pay/${this.walletAddress}?amount=${amountToPay}`,
        "_blank"
      );
    }
    toggleOpen() {
      this.open = !this.open;

      if (this.open) {
        this.chatIcon.classList.add("hidden");
        this.closeIcon.classList.remove("hidden");
        this.messageContainer.classList.remove("hidden");
      } else {
        this.createMessageContainerContent();
        this.chatIcon.classList.remove("hidden");
        this.closeIcon.classList.add("hidden");
        this.messageContainer.classList.add("hidden");
      }
    }
  }

  const widget = new Widget();
})();
