package zotte.dingen.cqrs.conversation;

import org.junit.Before;
import org.junit.Test;

import static org.assertj.core.api.Assertions.assertThat;
import static zotte.dingen.cqrs.conversation.ConversationTestBuilder.aConversation;
import static zotte.dingen.cqrs.conversation.ConversationTestBuilder.aDefaultConversation;
import static zotte.dingen.cqrs.conversation.LineTestBuilder.aContextLine;
import static zotte.dingen.cqrs.conversation.LineTestBuilder.aSpeechLine;

public class ConversationValidatorTest {

    private ConversationValidator validator;

    @Before
    public void setUp() throws Exception {
        validator = new ConversationValidator();
    }

    @Test
    public void validate_AnySpeechLineWithoutParticipants_DoesNotValidate() throws Exception {
        Line punchLine = aSpeechLine().asPunchLine().withoutParticipants().build();
        Conversation conversation = aDefaultConversation().withId(null).withPunchLine(punchLine).build();

        assertThat(validator.validate(conversation)).isFalse();
    }

    @Test
    public void validate_AllSpeechLinesHaveAtLeast1Participant_Validates() throws Exception {
        Line punchLine = aContextLine().asPunchLine().withText("Snarf").withoutParticipants().build();
        Line textLine = aSpeechLine().withText("I said this line").withParticipants(new Participant("Gianni",false)).build();
        Conversation conversation = aConversation().withId(null).withLines(textLine).withPunchLine(punchLine).build();

        assertThat(validator.validate(conversation)).isTrue();
    }
}