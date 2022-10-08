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

      const pizzaIcon = document.createElement("img");
      pizzaIcon.src = "/images/pizza-toxic.png";
      pizzaIcon.classList.add("pizza-icon");
      this.chatIcon = pizzaIcon;

      const closeIcon = document.createElement("img");
      closeIcon.src = "/images/close.png";
      closeIcon.classList.add("icon", "hidden");
      this.closeIcon = closeIcon;

      const buyMeAPizzaText = document.createElement("p");
      buyMeAPizzaText.textContent = "Buy me a";
      buyMeAPizzaText.style.top = "60px";
      buyMeAPizzaText.style.left = "10px";
      buyMeAPizzaText.style.color = "#fff";
      buyMeAPizzaText.style.fontWeight = "bold";
      buyMeAPizzaText.style.fontSize = "12px";

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
              width: 30%;
              position: absolute;
              top: 18px;
              left: 18px;
              transition: transform .3s ease;
          }

          .pizza-icon {
            cursor: pointer;
            width: 70%;
            position: absolute;
            top: 8px;
            left: 7px;
            transition: transform .3s ease;
          }
  
          .hidden {
              transform: scale(0);
          }
  
          .button-container {
              background-color: #512DA8;
              width: 50px;
              height: 50px;
              border-radius: 50%;
  
          }
  
          .message-container {
            background: rgba(255, 255, 255, 0.2);
            border-radius: 16px;
            box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
            backdrop-filter: blur(5px);
            -webkit-backdrop-filter: blur(5px);
            border: 1px solid rgba(255, 255, 255, 0.3);              width: 400px;
              right: -25px;
              bottom: 66px;
              max-height: 400px;
              position: absolute;
              transition: max-height .3s ease;
              font-family: Helvetica, sans-serif;
          }

          .options-container {
            display: flex;
            width: 100%;
            justify-content: space-evenly;	
          }
  
          .message-container.hidden {
              max-height: 0;
          }
  
          .message-container .content {
              color: white;
              padding: 10px;
              display: flex;
              flex-direction: column;
          }
  
          .message-container h2 {
              margin: 0;
              padding: 20px;
              display: flex;
              justify-content: center;
              color: #fff;
              border-top-left-radius: 16px;
              border-top-right-radius: 16px;
              background-color: #512DA8;
          }
  
          .message-container form * {
              margin: 5px 0;
          }
  
          .message-container form button { 
              cursor: pointer;
              background-color: #512DA8;
              color: #fff;
              font-weight: bold;
              border: 0;
              border-radious: 4px;
              padding: 10px
          }
  
          .message-container form button:hover { 
              background-color: #1A1F2E;
          }
      `;
    }

    createMessageContainerContent() {
      this.messageContainer.innerHTML = ``;

      const title = document.createElement("h2");
      title.textContent = "Like what I do? Buy me a Solana pizza!";

      const form = document.createElement("form");
      form.classList.add("content");

      const newline = document.createElement("br");

      const optionsContainer = document.createElement("div");
      optionsContainer.classList.add("options-container");

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

      const radioboxPay10 = document.createElement("input");
      radioboxPay10.type = "radio";
      radioboxPay10.id = "pay10";
      radioboxPay10.value = "10";
      radioboxPay10.name = "pay";

      const labelPay10 = document.createElement("label");
      labelPay10.htmlFor = "pay10";
      const descriptionPay10 = document.createTextNode("10$");
      labelPay10.appendChild(radioboxPay10);
      labelPay10.appendChild(descriptionPay10);

      const radioboxPay20 = document.createElement("input");
      radioboxPay20.type = "radio";
      radioboxPay20.id = "pay20";
      radioboxPay20.value = "20";
      radioboxPay20.name = "pay";

      const labelPay20 = document.createElement("label");
      labelPay20.htmlFor = "pay20";
      const descriptionPay20 = document.createTextNode("20$");
      labelPay20.appendChild(radioboxPay20);
      labelPay20.appendChild(descriptionPay20);

      const btn = document.createElement("button");
      btn.textContent = "DONATE";

      form.appendChild(optionsContainer);

      optionsContainer.appendChild(labelPay1);
      optionsContainer.appendChild(labelPay5);
      optionsContainer.appendChild(labelPay10);
      optionsContainer.appendChild(labelPay20);

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
