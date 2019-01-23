export const vuexStore = {
  state: {
    messages: []
  },
  sendMesssage(message, user_to) {
    let obj_message = {
      user_from: '',
      user_to: user_to,
      message: message,
      created: new Date(),
      status: 'sent', // sent, recived, active
      is_new: true
    }
    this.state.messages.push({ message_id: obj_message})
  },
}
